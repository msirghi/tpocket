import ExtensionService from '../utils/ExtensionService';

// TODO: modify on translations add
describe('ExtensionService', () => {
  it('should return name of month if number is 0', () => {
    expect(ExtensionService.getMonthName(0)).toBe('January');
  });

  it('should return name of month if number is 1', () => {
    expect(ExtensionService.getMonthName(1)).toBe('February');
  });

  it('should return name of month if number is 2', () => {
    expect(ExtensionService.getMonthName(2)).toBe('March');
  });

  it('should return name of month if number is 3', () => {
    expect(ExtensionService.getMonthName(3)).toBe('April');
  });

  it('should return name of month if number is 4', () => {
    expect(ExtensionService.getMonthName(4)).toBe('May');
  });

  it('should return name of month if number is 5', () => {
    expect(ExtensionService.getMonthName(5)).toBe('June');
  });

  it('should return name of month if number is 6', () => {
    expect(ExtensionService.getMonthName(6)).toBe('July');
  });

  it('should return name of month if number is 7', () => {
    expect(ExtensionService.getMonthName(7)).toBe('August');
  });

  it('should return name of month if number is 8', () => {
    expect(ExtensionService.getMonthName(8)).toBe('September');
  });

  it('should return name of month if number is 9', () => {
    expect(ExtensionService.getMonthName(9)).toBe('October');
  });

  it('should return name of month if number is 10', () => {
    expect(ExtensionService.getMonthName(10)).toBe('November');
  });

  it('should return name of month if number is 11', () => {
    expect(ExtensionService.getMonthName(11)).toBe('December');
  });
});
