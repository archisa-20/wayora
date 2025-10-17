import javax.swing.*;
import java.awt.*;

public class TripManagementPanel extends CardPanel {
    public TripManagementPanel() {
        super(new BorderLayout());

        JLabel title = new JLabel("Manage Your Trips");
        title.setFont(ModernTheme.FONT_BOLD);
        title.setForeground(ModernTheme.TEXT_PRIMARY);
        add(title, BorderLayout.NORTH);

        JTextArea tripsArea = new JTextArea("Your trips will appear here...");
        tripsArea.setFont(ModernTheme.FONT_REGULAR);
        JScrollPane scroll = new JScrollPane(tripsArea);
        scroll.setBorder(BorderFactory.createEmptyBorder());
        add(scroll, BorderLayout.CENTER);

        JPanel buttons = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        RoundedButton addBtn = new RoundedButton("Add Trip", IconFactory.plus(16, Color.WHITE));
        RoundedButton editBtn = new RoundedButton("Edit Trip", IconFactory.edit(16, Color.WHITE));
        RoundedButton delBtn = new RoundedButton("Delete Trip", IconFactory.trash(16, Color.WHITE));

        addBtn.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Trip Added"));
        editBtn.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Trip Updated"));
        delBtn.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Trip Deleted"));

        buttons.setOpaque(false);
        buttons.add(addBtn);
        buttons.add(editBtn);
        buttons.add(delBtn);
        add(buttons, BorderLayout.SOUTH);
    }

    private void showToast(Window owner, String msg) {
        Toast t = new Toast(owner, msg);
        Point br = owner.getLocationOnScreen();
        br.translate(owner.getWidth(), owner.getHeight());
        t.showToast(br);
    }
}

