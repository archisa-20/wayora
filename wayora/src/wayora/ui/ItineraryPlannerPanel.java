import javax.swing.*;
import java.awt.*;

public class ItineraryPlannerPanel extends CardPanel {
    public ItineraryPlannerPanel() {
        super(new BorderLayout());

        JLabel title = new JLabel("Plan Your Itinerary");
        title.setFont(ModernTheme.FONT_BOLD);
        title.setForeground(ModernTheme.TEXT_PRIMARY);
        add(title, BorderLayout.NORTH);

        JTable itineraryTable = new JTable(
            new Object[][] {
                {"Day 1", "Visit Museum", "10:00 AM"},
                {"Day 2", "Beach Trip", "9:00 AM"}
            },
            new String[] {"Day", "Activity", "Time"}
        );
        itineraryTable.setFont(ModernTheme.FONT_REGULAR);
        itineraryTable.setRowHeight(28);
        itineraryTable.getTableHeader().setFont(ModernTheme.FONT_MEDIUM);
        JScrollPane tableScroll = new JScrollPane(itineraryTable);
        tableScroll.setBorder(BorderFactory.createEmptyBorder());
        add(tableScroll, BorderLayout.CENTER);

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        footer.setOpaque(false);
        RoundedButton addBtn = new RoundedButton("Add Activity", IconFactory.plus(16, Color.WHITE));
        addBtn.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Activity Added"));
        footer.add(addBtn);
        add(footer, BorderLayout.SOUTH);
    }

    private void showToast(Window owner, String msg) {
        Toast t = new Toast(owner, msg);
        Point br = owner.getLocationOnScreen();
        br.translate(owner.getWidth(), owner.getHeight());
        t.showToast(br);
    }
}
