const express = require('express');
const multer = require('multer');
const fs = require('fs')
const db = require('./config/database');
const userModel = require('./models/userSchema');

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads/'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    // userModel.find({}).then((data) => {
    //     return res.render('index', { data : data });
    // }).catch((err) => {
    //     console.error(err);
    //     return false;
    // });
    return res.render('index')
});

app.get('/view', (req, res) => {
    userModel.find({}).then((data) => {
        return res.render('view', { data: data });
    }).catch((err) => {
        console.error(err);
        return false;
    });
})

app.get('/edit', (req, res) => {
    return res.render('edit')
})

app.get('/add', (req, res) => {
    return res.render('add')
})

let fileupload = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: fileupload }).single('image')

app.post('/insertData', upload, (req, res) => {
    const { title, author, date, id } = req.body
    if (id) {
        if (req.file) {
            let image = req.file.path
            userModel.findById(id).then((data) => {
                fs.unlinkSync(data.image)
            }).catch((err) => {
                console.log(err)
                return false
            })
            userModel.findByIdAndUpdate(id, { title, author, date, image }).then(() => {
                return res.redirect('view')
            }).catch((err) => {
                console.log(err)
                return false
            })
        } else {
            userModel.findById(id).then((data) => {
                let image = data.image
                userModel.findByIdAndUpdate(id, { title, author, date, image }).then(() => {
                    return res.redirect('view')
                }).catch((err) => {
                    console.log(err)
                    return false
                })
            }).catch((err) => {
                console.log(err)
                return false
            })
        }
    } else {
        let image = req.file.path
        userModel.create({ title, author, date, image }).then(() => {
            return res.redirect('view')
        }).catch((err) => {
            console.log(err)
            return false
        })
    }
})

app.get('/deleteData/:id', (req, res) => {

    let { id } = req.params

    userModel.findById(id).then((data) => {
        fs.unlinkSync(data.image)
    }).catch((err) => {
        console.log(err);
        return false
    })

    userModel.findByIdAndDelete(id).then((data) => {
        console.log("Book Deleted Successfully");
        return res.redirect('/view')
    }).catch((err) => {
        console.log(err);
        return false
    })
})

app.get('/editData/:id', (req, res) => {
    let { id } = req.params

    userModel.findById(id).then((data) => {
        console.log(data);
        return res.render('edit', { data })
    }).catch((err) => {
        console.log(err);
        return false
    })
})

app.listen(port, (err) => {
    if (err) {
        console.log("Server Not Started");
        return false
    }
    console.log("Server Started At http://localhost:" + port);
})