import javax.swing.*;
import java.awt.*;

public class AccommodationPanel extends CardPanel {
    public AccommodationPanel() {
        super(new BorderLayout());

        JLabel title = new JLabel("Accommodation Details");
        title.setFont(ModernTheme.FONT_BOLD);
        title.setForeground(ModernTheme.TEXT_PRIMARY);
        add(title, BorderLayout.NORTH);

        JTextArea hotelInfo = new JTextArea("Hotel details will appear here...");
        hotelInfo.setFont(ModernTheme.FONT_REGULAR);
        JScrollPane scroll = new JScrollPane(hotelInfo);
        scroll.setBorder(BorderFactory.createEmptyBorder());
        add(scroll, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        btnPanel.setOpaque(false);
        RoundedButton add = new RoundedButton("Add Accommodation", IconFactory.plus(16, Color.WHITE));
        RoundedButton edit = new RoundedButton("Edit", IconFactory.edit(16, Color.WHITE));
        RoundedButton del = new RoundedButton("Delete", IconFactory.trash(16, Color.WHITE));
        add.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Accommodation Added"));
        edit.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Accommodation Updated"));
        del.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Accommodation Deleted"));
        btnPanel.add(add);
        btnPanel.add(edit);
        btnPanel.add(del);
        add(btnPanel, BorderLayout.SOUTH);
    }

    private void showToast(Window owner, String msg) {
        Toast t = new Toast(owner, msg);
        Point br = owner.getLocationOnScreen();
        br.translate(owner.getWidth(), owner.getHeight());
        t.showToast(br);
    }
}
