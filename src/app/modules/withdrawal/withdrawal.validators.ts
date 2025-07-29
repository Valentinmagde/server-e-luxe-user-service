// import validator from "validator";
// import { body } from "express-validator";

// export const validateWithdrawal = [
//   body('amount')
//     .isFloat({ min: 50 })
//     .withMessage('Minimum withdrawal amount is 50€'),

//   body('bankDetails.iban')
//     .isIBAN()
//     .withMessage('Invalid IBAN format'),

//   body('bankDetails.bic')
//     .isBIC()
//     .withMessage('Invalid BIC/SWIFT code'),

//   body('bankDetails.accountHolder')
//     .notEmpty()
//     .withMessage('Account holder name is required')
//     .isLength({ max: 100 })
//     .withMessage('Account holder name too long')
// ];
