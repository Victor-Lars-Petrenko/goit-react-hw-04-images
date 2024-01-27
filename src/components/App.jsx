import { useState, useEffect } from 'react';

import { getImages } from '../api/pixabay';
import css from './App.module.css';

import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { Loader } from './Loader';
import { Button } from './Button';
import { Modal } from './Modal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const [keyWord, setKeyWord] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [imageToShow, setImageToShow] = useState({});
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!keyWord) return;
    updateQueryResult(keyWord, page)
      .then(totalHits => {
        if (totalHits === 0) {
          return toast.info('Sorry, there are no results for your request');
        }
        if (page === 1) {
          return toast.success(
            `We found ${totalHits} ${totalHits === 1 ? 'result' : 'results'}`
          );
        }
        if (page < Math.ceil(totalHits / 12)) {
          const rest = totalHits - page * 12;
          return toast.success(
            `We found ${rest} more ${rest === 1 ? 'result' : 'results'}`
          );
        }
        if (page === Math.ceil(totalHits / 12)) {
          return toast.info('There are no more results for this request');
        }
      })
      .catch(() => toast.error('Something get wrong'))
      .finally(() => {
        setLoading(false);
      });
  }, [keyWord, page]);

  const updateQueryResult = async (searchQuery, pageNumber) => {
    setLoading(true);
    const { totalHits, hits } = await getImages(searchQuery, pageNumber);
    setResults(prev => [...prev, ...hits]);
    setPage(pageNumber);
    setLoadMore(pageNumber < Math.ceil(totalHits / 12));
    return totalHits;
  };

  const incrementPage = () => {
    setPage(prev => prev + 1);
  };

  const handleFormSubmit = inputKey => {
    const validatedKey = inputKey.toLowerCase();
    if (keyWord === validatedKey) {
      return toast.info(
        `You are already viewing results for the query "${inputKey}"`
      );
    }
    setKeyWord(validatedKey);
    setPage(1);
    setResults([]);
  };

  const handleItemClick = (imageUrl, tags) => {
    setOpenModal(true);
    setImageToShow({ imageUrl, tags });
  };

  const closeModal = () => {
    setOpenModal(false);
    setImageToShow({});
  };

  return (
    <section className={css.app}>
      <Searchbar onSubmit={handleFormSubmit} />
      {results[0] && <ImageGallery items={results} onClick={handleItemClick} />}
      {loading && <Loader />}
      {loadMore && !loading && <Button onClick={incrementPage} />}
      {openModal && (
        <Modal close={closeModal}>
          <img src={imageToShow.imageUrl} alt={imageToShow.tags}></img>
        </Modal>
      )}
      <ToastContainer autoClose={3000} />
    </section>
  );
};
