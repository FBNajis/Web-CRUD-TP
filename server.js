const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const engine = require('ejs-mate');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 
app.set('view engine', 'ejs');

app.engine('ejs', engine);

// Koneksi MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/tugasApp', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const TugasSchema = new mongoose.Schema({
    judul: { type: String, required: true},
    subJudul: { type: String, required: true},
    kategori: { type: String, required: true},
    deadline: { type: String, required: true},
    deskripsi: { type: String, required: true},
}, { timestamps: true});

// Model
const Tugas = mongoose.model('Tugas', TugasSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/submit', async (req, res) => {
    const tugas = await Tugas.find().sort({ _id: -1 });
    res.render('submit', { tugas });
});

app.post('/submit', async (req, res) => {
    const { judul, subJudul, kategori, deadline, deskripsi } = req.body;
    const tugas = new Tugas({ judul, subJudul, kategori, deadline, deskripsi });
    await tugas.save();
    res.redirect('/submit');
});

app.get('/edit/:id', async (req, res) => {
    const tugas = await Tugas.findById(req.params.id);
    res.render('edit', { tugas });
});

app.post('/edit/:id', async (req, res) => {
    const { judul, subJudul, kategori, deadline, deskripsi } = req.body;
    await Tugas.findByIdAndUpdate(req.params.id, { judul, subJudul, kategori, deadline, deskripsi });
    res.redirect('/submit');
});

app.post('/delete/:id', async (req, res) => {
    await Tugas.findByIdAndDelete(req.params.id);
    res.redirect('/submit');
});

app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
