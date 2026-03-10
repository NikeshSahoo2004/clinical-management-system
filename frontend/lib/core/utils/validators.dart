import 'package:frontend/core/constants/app_strings.dart';

//  Form Validations
class Validators {
  // email validations
  static String? email(String? value) {
    if(value == null || value.isEmpty) {
      return AppStrings.required;
    }

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if(!emailRegex.hasMatch(value)) {
      return AppStrings.invalidEmail;
    }

    return null;
  }

  // password validations
  static String? password(String? value) {
    if(value == null || value.isEmpty) {
      return AppStrings.required;
    }

    if(value.length < 6) {
      return AppStrings.passwordTooShort;
    }

    return null;
  }

  // required field validation
  static String? required(String? value, {String? fieldName}) {
    if(value == null || value.isEmpty) {
      return fieldName != null ? '$fieldName is required' : AppStrings.required;
    }
    return null;
  }

  // phone number validation
  static String? phone(String? value) {
    if(value == null || value.isEmpty) {
      return AppStrings.required;
    }
    final phoneRegex = RegExp(r'^\+?[0-9]{10,15}$');

    if(!phoneRegex.hasMatch(value)) {
      return 'Invalid phone number';
    }
    return null;
  }

  // confirm password validation
  static String? confirmPassword(String? value, String password) {
    if(value == null || value.isEmpty) {
      return AppStrings.required;
    }

    if(value != password) {
      return AppStrings.passwordMismatch;
    }
    return null;
  }

  // no. validation
  static String? number(String? value, {String? fieldName}) {
    if(value == null || value.isEmpty) {
      return fieldName != null ? '$fieldName is required' : AppStrings.required;
    }

    if(double.tryParse(value) == null) {
      return 'Please enter a valid number';
    }

    return null;
  }
}