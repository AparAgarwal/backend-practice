import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{
    res.send('Hello, World!');
})

const notes = [];

app.post('/post', (req, res)=>{
    notes.push(req.body);
    return res.status(201).json({
        message: `POST request received!`,
        data: req.body
    });
});

app.get('/post', (req, res)=>{
    return res.status(200).json({
        message: 'GET request received!',
        data: notes
    });
});

app.delete('/post/:idx', (req, res)=>{
    const idx = parseInt(req.params.idx, 10);
    if (idx >= 0 && idx < notes.length) {
        notes.splice(idx, 1);
        return res.status(200).json({
            message: `Note at index ${idx} deleted.`,
            data: notes
        });
    } else {
        return res.status(404).json({
            message: `Note at index ${idx} not found.`
        });
    }
});

export default app;