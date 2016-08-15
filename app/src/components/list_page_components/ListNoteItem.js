import React from 'react';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';

const ListNoteItem = ({ note, deleteNote }) => (
  <div className="list-note-item">
    <h3>{note.name}</h3>
    <div>Author: {note.owner}</div>
    <div>Created: {(new Date(note.saved)).toLocaleString()}</div>
    <div>Updated: {(new Date(note.updated)).toLocaleString()}</div>
    <div>Tags: {note.tags.join(', ')}</div>
    {/*<Link to={`/notes/${note._id}`}>Open this note</Link>*/}
    <button className="save" onClick={() => browserHistory.push(`/notes/${note._id}`)}>Open</button>
    <button className="delete" onClick={() => deleteNote(note._id)}>Delete</button>
  </div>
);

export default ListNoteItem;