import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 3, 
    maxlength: 20, 
    trim: true
   },
   
  phoneNumber: { 
    type: String, 
    required: true,
    trim: true, 
    // match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'] 
  },
  email: {
     type: String,
     trim: true, 
    //  match: [/^[\w.-]+@[\w.-]+\.\w{2,}$/, 'Invalid email format'] 
     },
     photo:{
      type: String,
     },
  isFavourite: { 
    type: Boolean, 
    default: false
   }, 
  contactType: { 
    type: String, 
    enum: ['work', 'home', 'personal'], 
    default: 'personal', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true },
},
 { timestamps: true ,
  versionKey: false
 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;

