import ValidationService from '../utils/ValidationService';

describe('ValidationService', () => {
  it('should return false on invalid email', () => {
    expect(ValidationService.validateEmailStr('invalid')).toBeFalsy();
  });

  it('should return true on valid email', () => {
    expect(ValidationService.validateEmailStr('validemail@email.com')).toBeTruthy();
  });

  it('should return true on weak password', () => {
    expect(ValidationService.isPasswordWeak('asd')).toBeTruthy();
  });

  it('should return false on strong password', () => {
    expect(ValidationService.isPasswordWeak('Password1@!')).toBeFalsy();
  });
});
