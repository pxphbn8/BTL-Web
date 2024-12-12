// models/uploadFile.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  attachments: [
    {
      fileName: { type: String, required: true },
      filePath: { type: String, required: true },
    },
  ],
});

const uploadFile = mongoose.model('File', taskSchema);

export default uploadFile;

