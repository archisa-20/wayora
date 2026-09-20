import 'package:flutter/material.dart';

import '../features/home/presentation/home_page.dart';
import '../core/theme/app_theme.dart';

class WayoraApp extends StatelessWidget {
  const WayoraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wayora',
      theme: AppTheme.light,
      home: const HomePage(),
    );
  }
}
