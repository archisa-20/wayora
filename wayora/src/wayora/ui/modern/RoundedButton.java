import javax.swing.*;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;

public class RoundedButton extends JButton {
    private Color backgroundColor;
    private Color hoverColor;
    private Color textColor;

    public RoundedButton(String text, Icon icon) {
        super(text, icon);
        init();
    }

    public RoundedButton(String text) {
        super(text);
        init();
    }

    private void init() {
        setFocusPainted(false);
        setBorderPainted(false);
        setContentAreaFilled(false);
        setFont(ModernTheme.FONT_MEDIUM);
        setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        backgroundColor = ModernTheme.PRIMARY;
        hoverColor = ModernTheme.PRIMARY_DARK;
        textColor = Color.WHITE;
        setForeground(textColor);
        setOpaque(false);

        // Accessible name will be the text; icon-only buttons should setAccessibleName
        getAccessibleContext().setAccessibleDescription("button");

        // Hover state
        addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent evt) { repaint(); }
            public void mouseExited(java.awt.event.MouseEvent evt) { repaint(); }
        });
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        Color fill = getModel().isRollover() ? hoverColor : backgroundColor;
        g2.setColor(fill);
        Shape rr = new RoundRectangle2D.Float(0, 0, getWidth(), getHeight(), ModernTheme.RADIUS, ModernTheme.RADIUS);
        g2.fill(rr);

        // Shadow
        g2.setColor(new Color(0,0,0,30));
        g2.drawRoundRect(0, 0, getWidth()-1, getHeight()-1, ModernTheme.RADIUS, ModernTheme.RADIUS);

        g2.dispose();
        super.paintComponent(g);
    }
}


