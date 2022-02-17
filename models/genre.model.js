module.exports = (mongoose) => {
    const genreSchema = mongoose.Schema({
        genreid : {
            required: true,
            type: Number
        },
        genre : {
            required: true,
            type: String
        }

    },
    {timeStamps: true}
    )

    const Genre = mongoose.model("genre", genreSchema);
    return Genre;
}
