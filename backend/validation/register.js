import Validator from 'validator';
import isEmpty from './is-empty';

const validateRegisterInput = data => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.passwordConfirm = !isEmpty(data.passwordConfirm) ? data.passwordConfirm : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.nameLength = 'Длина логина должна быть от 2 до 30 символов';
  }
  if (Validator.isEmpty(data.nameEmpty)) {
    errors.nameEmpty = 'Введите логин';
  }
  if (!Validator.isEmail(data.email)) {
    errors.emailWrong = 'Неверный Email';
  }
  if (Validator.isEmpty(data.email)) {
    errors.emailEmpty = 'Введите Email';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.passwordLength = 'Длина пароля должна быть от 6 до 30 символов';
  }
  if (Validator.isEmpty(data.password)) {
    errors.passwordEmpty = 'Введите пароль';
  }
  if (!Validator.isLength(data.passwordСonfirm, { min: 6, max: 30 })) {
    errors.passwordConfirmLength = 'Длина пароля должна быть от 6 до 30 символов';
  }
  if (!Validator.equals(data.password, data.passwordСonfirm)) {
    errors.passwordConfirmWrong = 'Пароли не совпадают';
  }
  if (Validator.isEmpty(data.passwordСonfirm)) {
    errors.passwordConfirmEmpty = 'Подтвердите пароль';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
};

export default validateRegisterInput;
