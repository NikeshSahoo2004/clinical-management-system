import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// Toast notification helper using SnackBar
class ToastHelper {
  // Show success toast
  static void showSuccess(BuildContext context, String message) {
    _showSnackBar(
      context,
      message,
      AppColors.success,
      Icons.check_circle,
    );
  }

  // Show error toast
  static void showError(BuildContext context, String message) {
    _showSnackBar(
      context,
      message,
      AppColors.error,
      Icons.error,
    );
  }

  // Show info toast
  static void showInfo(BuildContext context, String message) {
    _showSnackBar(
      context,
      message,
      AppColors.info,
      Icons.info,
    );
  }

  // Show warning toast
  static void showWarning(BuildContext context, String message) {
    _showSnackBar(
      context,
      message,
      AppColors.warning,
      Icons.warning,
    );
  }

  // Private method to show SnackBar
  static void _showSnackBar(
    BuildContext context,
    String message,
    Color backgroundColor,
    IconData icon,
  ) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(icon, color: AppColors.white),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(color: AppColors.white),
              ),
            ),
          ],
        ),
        backgroundColor: backgroundColor,
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
    );
  }
}