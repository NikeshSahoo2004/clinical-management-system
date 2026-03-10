import 'package:intl/intl.dart';

// Date and time formatting utilities
class DateFormatter {
  // Format: Jan 15, 2026
  static String formatDate(DateTime date) {
    return DateFormat('MMM d, y').format(date);
  }

  // Format: 03:30 PM
  static String formatTime(DateTime time) {
    return DateFormat('hh:mm a').format(time);
  }

  // Format: Jan 15, 2026 at 03:30 PM
  static String formatDateTime(DateTime dateTime) {
    return DateFormat('MMM d, y \'at\' hh:mm a').format(dateTime);
  }

  // Format: 2026-01-15 (for API)
  static String formatDateForApi(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(date);
  }

  // Format: 15:30:00 (for API)
  static String formatTimeForApi(DateTime time) {
    return DateFormat('HH:mm:ss').format(time);
  }

  // Format: 2026-01-15T15:30:00 (ISO format for API)
  static String formatDateTimeForApi(DateTime dateTime) {
    return dateTime.toIso8601String();
  }

  // Parse date string from API
  static DateTime? parseDate(String? dateString) {
    if (dateString == null || dateString.isEmpty) return null;
    try {
      return DateTime.parse(dateString);
    } catch (e) {
      return null;
    }
  }

  // Get relative time (e.g., "2 hours ago", "Yesterday")
  static String getRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 365) {
      final years = (difference.inDays / 365).floor();
      return '$years ${years == 1 ? 'year' : 'years'} ago';
    } else if (difference.inDays > 30) {
      final months = (difference.inDays / 30).floor();
      return '$months ${months == 1 ? 'month' : 'months'} ago';
    } else if (difference.inDays > 0) {
      if (difference.inDays == 1) {
        return 'Yesterday';
      }
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} ${difference.inHours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} ${difference.inMinutes == 1 ? 'minute' : 'minutes'} ago';
    } else {
      return 'Just now';
    }
  }

  // Check if date is today
  static bool isToday(DateTime date) {
    final now = DateTime.now();
    return date.year == now.year && 
           date.month == now.month && 
           date.day == now.day;
  }

  // Check if date is tomorrow
  static bool isTomorrow(DateTime date) {
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    return date.year == tomorrow.year && 
           date.month == tomorrow.month && 
           date.day == tomorrow.day;
  }

  // Get day name (Monday, Tuesday, etc.)
  static String getDayName(DateTime date) {
    return DateFormat('EEEE').format(date);
  }

  // Get month name (January, February, etc.)
  static String getMonthName(DateTime date) {
    return DateFormat('MMMM').format(date);
  }
}