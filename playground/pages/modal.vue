<script setup>

</script>

<template>
  <div class="modal modal_active">
    <div class="modal__overlay"/>
    <div class="modal__container" v-scrollable="{inheritanceDimensions: true, classes: ['--small']}">
      <div class="modal-confirm">
        <div class="modal-confirm__close-button-container">
          <div class="modal-confirm__close-button"/>
        </div>
        <div class="modal-confirm__question">Вы уверены?</div>
        <div class="modal-confirm__actions">
          <button class="btn --outline-contrast-danger --big --full-width">Нет</button>
          <button class="btn --success --big --full-width">Да</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
  pointer-events: none;
}
.modal_active {
  pointer-events: auto;
}
.modal__overlay {
  background: black;
  position: fixed;
  opacity: 0.5;
  width: 100%;
  height: 100%;
  z-index: 4;
  top: 0;
}
.modal__container {
  width: 100%;
  top: 0;
  z-index: 5;
  max-height: 100%;
  max-width: 570px;
  background: white;
  overflow-y: auto;
  border-radius: 5px;
}
.modal__container.--small {
  max-width: 300px;
}
/* Пресеты */
.modal-confirm {
  padding: 20px;
}
.modal-confirm__question {
  font-size: 20px;
  text-align: center;
}
.modal-confirm__actions {
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
}
.modal-confirm__actions > button {
  margin-left: 10px;
}
.modal-confirm__actions > button:first-child {
  margin-left: 0;
}
.modal-confirm__more {
  margin-top: 10px;
  text-align: center;
  color: #757575;
}
.modal-confirm__close-button-container {
  position: relative;
  top: -13px;
  right: -14px;
}
.modal-confirm__close-button {
  position: absolute;
  width: 25px;
  height: 25px;
  right: 0;
}
.modal-confirm__close-button:before, .modal-confirm__close-button:after {
  position: absolute;
  content: " ";
  height: 25px;
  width: 2px;
  right: 12px;
  background-color: #de4020;
}
.modal-confirm__close-button:before {
  transform: rotate(45deg);
}
.modal-confirm__close-button:after {
  transform: rotate(-45deg);
}
.modal-confirm__close-button:hover {
  cursor: pointer;
}
.modal-confirm__close-button:hover:before, .modal-confirm__close-button:hover:after {
  background-color: orange;
}
</style>