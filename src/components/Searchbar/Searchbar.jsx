import { useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import css from './Searchbar.module.css';

import { toast } from 'react-toastify';

export const Searchbar = ({ onSubmit }) => {
  const [keyWord, setKeyWord] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const validKeyWord = keyWord.trim();
    reset();

    if (validKeyWord === '') {
      return toast.warning('Please fill empty field');
    }

    onSubmit(validKeyWord);
  };

  const reset = () => {
    setKeyWord('');
  };

  const handleChange = e => {
    setKeyWord(e.target.value);
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={handleSubmit}>
        <button type="submit" className={css.button}>
          <span className={css.buttonLabel}>
            <IoMdSearch className={css.buttonLabel} />
          </span>
        </button>

        <input
          className={css.input}
          name="formInput"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={keyWord}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
