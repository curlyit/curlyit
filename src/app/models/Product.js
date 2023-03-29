const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['accessory', 'food', 'lineage'],
        },
        describe: {
            type: String,
            required: true,
        },
        image: {
            data: Buffer,
            contentType: String,
            name: String,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true },
);

productSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
