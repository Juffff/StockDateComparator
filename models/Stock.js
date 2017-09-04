import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const StockSchema = new Schema({
  name: String,
  data: Schema.Types.Mixed
});
const Stock = mongoose.model('Stock', StockSchema);
