const Note = require('../models/note.js');
const User = require('../models/user.js');


module.exports = function(passport) {

  const getNote = function*() {
    const id = this.params.id;

    let note;
    try {
      note = yield Note.findById(id).exec();
    } catch (e) {
      return this.status = 404;
    }

    if (!note) {
      this.status = 404;
    } else {
      this.set({ 'Content-Type': 'application/json' });
      this.body = JSON.stringify(note);
      this.status = 200;
    }
  };


  const getAllNotes = function*() {
    // TODO: find notes that belong to this user
    if (!this.isAuthenticated()) {
      this.status = 200;
      return this.body = JSON.stringify([]);
    }

    console.log(this.req.user.username);

    const query = this.request.query;
    // console.log(query);
    const tagsQuery = query.tags;
    
    let allNotes;

    if (typeof tagsQuery === 'string') {
      allNotes = yield Note.find({ tags: tagsQuery }, '-value').exec();
    } else if (tagsQuery && tagsQuery.length > 1) {
      allNotes = yield Note.find({ tags: { "$in" : tagsQuery} }, '-value').exec();
    } else {
      allNotes = yield Note.find({}, '-value').exec();
    }

    this.set({ 'Content-Type': 'application/json' });
    this.body = JSON.stringify(allNotes);
    this.status = 200;
  };


  const postNote = function*() {
    const note = this.request.body;

    // parsing tags (if needed)
    if (typeof note.tags === 'string') {
      let cleanTagsArray = parseTags(note.tags);
      // console.log(cleanTagsArray);
      note.tags = cleanTagsArray;
    }

    if (this.isAuthenticated()) {
      note.owner = this.req.user.username;
    }

    const newNote = new Note(note);
    let savedNote;
    try {
      savedNote = yield newNote.save();
    } catch (e) {
      return this.status = 404;
    }

    this.set('location', '/api/notes/' + savedNote._id);
    this.status = 201;
  };


  const updateNote = function*() {
    const id = this.params.id;

    const update = this.request.body;
    update.updated = Date.now();

    // parsing tags (if needed)
    if (typeof update.tags === 'string') {
      let cleanTagsArray = parseTags(update.tags);
      // console.log(cleanTagsArray);
      update.tags = cleanTagsArray;
    }


    try {
      yield Note.findByIdAndUpdate(id, update).exec();
    } catch (e) {
      return this.status = 404;
    }

    this.status = 200;
  };


  const deleteNote = function*() {
    const id = this.params.id;

    try {
      yield Note.findByIdAndRemove(id).exec();
    } catch (e) {
      return this.status = 404;
    }

    this.status = 200;
  };

  const parseTags = (tagsArray) => {
    return tagsArray.split(',')
             .map( el => el.trim() )
             .filter( el => el );
  };


  return {
    getNote,
    getAllNotes,
    postNote,
    updateNote,
    deleteNote
  };

};