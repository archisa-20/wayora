import javax.swing.*;
import java.awt.*;

public class PackingListPanel extends CardPanel {
    public PackingListPanel() {
        super(new BorderLayout());

        JLabel title = new JLabel("Packing List");
        title.setFont(ModernTheme.FONT_BOLD);
        title.setForeground(ModernTheme.TEXT_PRIMARY);
        add(title, BorderLayout.NORTH);

        JList<String> packingList = new JList<>(new String[] {"Passport", "Clothes", "Tickets"});
        packingList.setFont(ModernTheme.FONT_REGULAR);
        JScrollPane listScroll = new JScrollPane(packingList);
        listScroll.setBorder(BorderFactory.createEmptyBorder());
        add(listScroll, BorderLayout.CENTER);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        btnPanel.setOpaque(false);
        RoundedButton add = new RoundedButton("Add Item", IconFactory.plus(16, Color.WHITE));
        RoundedButton mark = new RoundedButton("Mark Packed", IconFactory.edit(16, Color.WHITE));
        RoundedButton del = new RoundedButton("Delete Item", IconFactory.trash(16, Color.WHITE));
        add.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Item Added"));
        mark.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Marked Packed"));
        del.addActionListener(e -> showToast((Window) SwingUtilities.getWindowAncestor(this), "Item Deleted"));
        btnPanel.add(add);
        btnPanel.add(mark);
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
