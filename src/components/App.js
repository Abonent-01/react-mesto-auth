import React from 'react';
import { useEffect, useState } from "react";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
/*import PopupWithForm from './PopupWithForm';*/
import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";

function App() {
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false)
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false)
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false)
    const [selectedCard, setSelectedCard] = React.useState(null)
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);

    useEffect(() => {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, card]) => {
        setCurrentUser(user);
        setCards(card);
      })
      .catch((err) => alert(err))
    }, [])

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard(null);
    }

    function handleCardLike(card) {
      const isLiked = card.likes.some(i => i._id === currentUser._id);
      api
        .likeCard(card._id, isLiked)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => alert(err));
    }

    function handleCardDelete(card) {
      api
        .deleteCard(card._id)
        .then(() => {
          setCards(state => state.filter((c) => c._id !== card._id));
        })
        .catch((err) => alert(err));
    }

    function handleUpdateAvatar(value) {
      api
        .updateUserAvatar(value)
        .then((res) => {
          setCurrentUser(res);
          closeAllPopups();
        })
        .catch((err) => alert(err));
    }

    function handleUpdateUser(value) {
      api
        .updateUserProfile(value)
        .then((res) => {
          setCurrentUser(res);
          closeAllPopups();
        })
        .catch((err) => alert(err));
    }

    function handleAddPlaceSubmit(card) {
      api
        .postCard(card)
        .then((newCard) => {
          setCards([newCard, ...cards]);
          closeAllPopups();
        })
        .catch((err) => alert(err));
    }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />

        <Main 
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
         />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        /> 

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
        
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
