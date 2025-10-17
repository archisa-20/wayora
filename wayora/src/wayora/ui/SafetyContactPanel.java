import javax.swing.*;
import java.awt.*;

public class SafetyContactPanel extends CardPanel {
    public SafetyContactPanel() {
        super(new BorderLayout());

        JLabel title = new JLabel("Emergency & Safety Contacts");
        title.setFont(ModernTheme.FONT_BOLD);
        title.setForeground(ModernTheme.TEXT_PRIMARY);
        add(title, BorderLayout.NORTH);

        JTable contactsTable = new JTable(
            new Object[][] {
                {"Police", "100"},
                {"Women’s Helpline", "1091"},
                {"Ambulance", "108"}
            },
            new String[] {"Service", "Contact Number"}
        );
        contactsTable.setFont(ModernTheme.FONT_REGULAR);
        contactsTable.setRowHeight(28);
        contactsTable.getTableHeader().setFont(ModernTheme.FONT_MEDIUM);
        JScrollPane tableScroll = new JScrollPane(contactsTable);
        tableScroll.setBorder(BorderFactory.createEmptyBorder());
        add(tableScroll, BorderLayout.CENTER);

        JPanel footer = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        footer.setOpaque(false);
        RoundedButton addBtn = new RoundedButton("Add Contact", IconFactory.plus(16, Color.WHITE));
        addBtn.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Contact Added"));
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
