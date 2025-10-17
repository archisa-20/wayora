import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Toast extends JWindow {
    private float alpha = 0f;
    private final String message;
    private final Color backgroundColor;
    private final Timer fadeInTimer;
    private final Timer stayTimer;
    private final Timer fadeOutTimer;

    public Toast(Window owner, String message) {
        super(owner);
        this.message = message;
        this.backgroundColor = new Color(33, 33, 33);
        setFocusableWindowState(false);
        setAlwaysOnTop(true);

        // Initialize timers ensuring fadeOutTimer exists before referenced
        fadeOutTimer = new Timer(15, new Animator(0.05f, false));
        fadeInTimer = new Timer(15, new Animator(0.05f, true));
        stayTimer = new Timer(1500, e -> { fadeInTimer.stop(); fadeOutTimer.start(); });
    }

    public void showToast(Point withinOwnerBottomRight) {
        pack();
        int x = withinOwnerBottomRight.x - getWidth() - 24;
        int y = withinOwnerBottomRight.y - getHeight() - 24;
        setLocation(x, y);
        setVisible(true);
        fadeInTimer.start();
        stayTimer.setInitialDelay(800);
        stayTimer.start();
    }

    @Override
    public void paint(Graphics g) {
        Graphics2D g2 = (Graphics2D) g.create();
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, alpha));

        Font font = ModernTheme.FONT_MEDIUM;
        g2.setFont(font);
        FontMetrics fm = g2.getFontMetrics();
        int textW = fm.stringWidth(message);
        int textH = fm.getHeight();
        int padX = 16, padY = 12;
        int w = textW + padX * 2;
        int h = textH + padY * 2;
        setSize(w, h);

        g2.setColor(backgroundColor);
        g2.fillRoundRect(0, 0, w, h, ModernTheme.RADIUS, ModernTheme.RADIUS);
        g2.setColor(Color.WHITE);
        g2.drawString(message, padX, padY + fm.getAscent());
        g2.dispose();
    }

    private class Animator implements ActionListener {
        private final float delta;
        private final boolean in;
        Animator(float delta, boolean in) { this.delta = delta; this.in = in; }
        public void actionPerformed(ActionEvent e) {
            alpha += in ? delta : -delta;
            alpha = Math.max(0f, Math.min(1f, alpha));
            repaint();
            if ((in && alpha >= 1f) || (!in && alpha <= 0f)) {
                ((Timer)e.getSource()).stop();
                if (!in) dispose();
            }
        }
    }
}


