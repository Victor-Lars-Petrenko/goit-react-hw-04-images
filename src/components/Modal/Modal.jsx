import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

export const Modal = ({ close, children }) => {
  const closeModal = useCallback(
    ({ target, currentTarget, code }) => {
      if (target === currentTarget || code === 'Escape') close();
    },
    [close]
  );

  useEffect(() => {
    document.addEventListener('keydown', closeModal);

    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = 'fixed';

    return () => {
      document.removeEventListener('keydown', closeModal);

      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [closeModal]);

  const modalRoot = document.querySelector('#modal-root');
  return createPortal(
    <div className={css.overlay} onClick={closeModal}>
      <div className={css.modal}>{children}</div>
    </div>,
    modalRoot
  );
};
