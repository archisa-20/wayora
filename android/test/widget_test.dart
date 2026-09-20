import 'package:flutter_test/flutter_test.dart';

import 'package:wayora/main.dart';

void main() {
  testWidgets('renders the Wayora home screen', (tester) async {
    await tester.pumpWidget(const WayoraApp());

    expect(find.text('Wayora'), findsOneWidget);
    expect(find.text('Plan your next journey.'), findsOneWidget);
  });
}
