import 'package:flutter/material.dart';

class WayoraPlaceholder extends StatelessWidget {
  const WayoraPlaceholder({required this.label, super.key});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(label);
  }
}
