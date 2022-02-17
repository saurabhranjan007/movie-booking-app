

module.exports = (mongoose) => {
    const { artistSchema } = require("./artist.model");

    const showsSchema = mongoose.Schema({
        id: {
            required: true,
            type: Number
        },
        theater: mongoose.Schema({
            name: { required: true, type: String },
            city: { required: true, type: String }
        }),
        language: { required: true, type: String },
        show_timing: { required: true, type: Date },
        available_seats: { required: true, type: String },
        unit_price: { required: true, type: Number }
    })

    const movieSchema = mongoose.Schema({
        movieid: {
            required: true,
            type: Number
        },
        title: {
            required: true,
            type: String
        },
        published: {
            required: true,
            type: Boolean
        },
        released: {
            required: true,
            type: Boolean
        },
        poster_url: {
            requied: true,
            type: String,
        },
        release_date: {
            requied: false,
            type: String,
        },
        publish_date: {
            requied: false,
            type: Date,
        },
        artists: {
            requied: true,
            type: [artistSchema],
        },
        genres: {
            requied: true,
            type: [String],
        },
        duration: {
            requied: true,
            type: Number,
        },
        critic_rating: {
            requied: false,
            type: Number,
        },
        trailer_url: {
            requied: true,
            type: String,
        },
        wiki_url: {
            requied: false,
            type: String,
        },
        story_line: {
            requied: true,
            type: String,
        },
        shows: {
            required: false,
            type: [showsSchema]
        }
    },
        { timeStamps: true }
    )

    const Movie = mongoose.model("movie", movieSchema);
    return Movie;
}
