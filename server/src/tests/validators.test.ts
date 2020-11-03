import ValidatorService from '../utils/validators';

export const validatorsTest = () =>
  describe('Validators', () => {
    it('should return true on valid name', () => {
      expect(ValidatorService.isNameValid('John')).toBeTruthy();
    });

    it('should return false on invalid name', () => {
      expect(ValidatorService.isNameValid('John 22')).toBeFalsy();
    });

    it('should return true on valid email', () => {
      expect(ValidatorService.isEmailValid('email@email.com')).toBeTruthy();
    });

    it('should return false on invalid email', () => {
      expect(ValidatorService.isEmailValid('email')).toBeFalsy();
    });
  });
