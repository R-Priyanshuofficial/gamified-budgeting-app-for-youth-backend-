import mongoose, { Schema } from "mongoose";

const LevelConfigSchema = new mongoose.Schema({
    level : {
        type : Number ,
        required : true,
        unique : true,
        min :[1 , "level must be >= 1"],
    },
    xpRequired :{
        type : Number,
        required : true,
        min : [1 ,"xpRequired must be >= 1"]
    },
},{timestamps: true})

LevelConfigSchema.index({level : 1}, { unique: true });

const LevelConfig = mongoose.model("LevelConfig" , LevelConfigSchema)
export default LevelConfig;