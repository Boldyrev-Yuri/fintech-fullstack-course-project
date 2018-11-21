import Validator from 'validator';
import isEmpty from './isEmpty';

const validateLoginInput = data => {
  const errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

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
  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateLoginInput;
