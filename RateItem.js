import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const RateItemSchema = new Schema({
  name: String,
  rate: Number,
  count: Number,
  description: String
});
const RateItem = mongoose.model('RateItem', RateItemSchema);
