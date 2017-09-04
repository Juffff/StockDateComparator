import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const DifferentsSchema = new Schema({
    name: String,
    date: Schema.Types.Mixed,
    added: Schema.Types.Mixed,
    removed: Schema.Types.Mixed
});
const Differents= mongoose.model('Differents', DifferentsSchema);
