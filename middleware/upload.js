const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '_' + file.originalname);
    }
});

// File filter function
const fileFilter = (allowedTypes, maxSize) => {
    return (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
        }
    };
};

// ID Proof upload (PDF, JPG, JPEG, PNG - Max 2MB)
const uploadIdProof = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter(['.pdf', '.jpg', '.jpeg', '.png'])
});

// Profile Picture upload (JPG, JPEG, PNG - Max 5MB)
const uploadProfilePicture = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter(['.jpg', '.jpeg', '.png'])
});

// Document upload (PDF, DOC, DOCX, JPG, JPEG, PNG - Max 5MB)
const uploadDocument = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter(['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'])
});

// Generic image upload
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter(['.jpg', '.jpeg', '.png'])
});

// Worker registration multi-file upload
const uploadWorkerFiles = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
}).fields([
    { name: 'id_proof', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'profile_picture', maxCount: 1 },
    { name: 'work_samples', maxCount: 1 }
]);

module.exports = {
    uploadIdProof,
    uploadProfilePicture,
    uploadDocument,
    uploadImage,
    uploadWorkerFiles
};
