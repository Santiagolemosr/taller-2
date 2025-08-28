const multer = require('multer');

// almacenamiento
const storage = multer.memoryStorage();
const upload =  multer({storage});

module.exports= upload;