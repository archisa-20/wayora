import javax.swing.*;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;

public class CardPanel extends JPanel {
    public CardPanel(LayoutManager layout) {
        super(layout);
        setOpaque(false);
        setBorder(BorderFactory.createEmptyBorder(16,16,16,16));
    }

    public CardPanel() {
        this(new BorderLayout());
    }

    @Override
    protected void paintComponent(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // shadow
        g2.setColor(ModernTheme.SHADOW);
        g2.fillRoundRect(6, 8, getWidth()-12, getHeight()-12, ModernTheme.RADIUS+2, ModernTheme.RADIUS+2);

        // surface
        g2.setColor(ModernTheme.SURFACE);
        Shape rr = new RoundRectangle2D.Float(0, 0, getWidth()-6, getHeight()-6, ModernTheme.RADIUS, ModernTheme.RADIUS);
        g2.fill(rr);

        g2.dispose();
        super.paintComponent(g);
    }
}


