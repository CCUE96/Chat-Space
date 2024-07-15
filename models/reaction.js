const {Schema,Types} = require('mongoose')

const reactionSchema = new Schema({
   reactionId:{
    type:Schema.Types.ObjectId,
    default:() => new mongoose.Types.ObjectId(),
   },

reactionBody:{
    type:String,
    required:true,
    maxlegnth:280,
},
username:{
    type:String,
    required:true
},
CreatedAt:{
    type:Date,
    default:Date.now,
    get:timestamp => new Date(timestamp).toLocaleString()
},
},{toJSON:{getters:true}});


module.exports = reactionSchema