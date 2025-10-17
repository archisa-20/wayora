import javax.swing.*;
import java.awt.*;
import java.awt.geom.GeneralPath;
import java.awt.image.BufferedImage;

public final class IconFactory {
    private IconFactory() {}

    public static Icon menu(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int barH = Math.max(2, size / 8);
        int gap = barH;
        g.fillRoundRect(size/6, size/6, size - size/3, barH, barH, barH);
        g.fillRoundRect(size/6, size/6 + barH + gap, size - size/3, barH, barH, barH);
        g.fillRoundRect(size/6, size/6 + 2*(barH + gap), size - size/3, barH, barH, barH);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon plus(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int t = Math.max(2, size / 8);
        g.fillRoundRect(size/2 - t/2, size/6, t, size - size/3, t, t);
        g.fillRoundRect(size/6, size/2 - t/2, size - size/3, t, t, t);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon trash(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int w = size - size/3; int x = size/6; int y = size/5; int h = size - y - size/8;
        g.fillRoundRect(x, y, w, h, size/8, size/8);
        g.fillRoundRect(x + w/4, y - size/8, w/2, size/10, size/8, size/8);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon edit(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        GeneralPath p = new GeneralPath();
        p.moveTo(size*0.2, size*0.7);
        p.lineTo(size*0.7, size*0.2);
        p.lineTo(size*0.85, size*0.35);
        p.lineTo(size*0.35, size*0.85);
        p.closePath();
        g.fill(p);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon list(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int barH = Math.max(2, size/10);
        int gap = barH;
        for (int i = 0; i < 3; i++) {
            g.fillRoundRect(size/5, size/5 + i*(barH+gap), size - size/5 - size/6, barH, barH, barH);
        }
        g.dispose();
        return new ImageIcon(img);
    }

    // New distinct icons for modules
    public static Icon mapPin(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int r = size/3;
        g.fillOval(size/2 - r/2, size/4 - r/2, r, r);
        GeneralPath pin = new GeneralPath();
        pin.moveTo(size/2.0, size/4.0 + r/2.0);
        pin.lineTo(size/2.0 - r/3.0, size - size/6.0);
        pin.lineTo(size/2.0 + r/3.0, size - size/6.0);
        pin.closePath();
        g.fill(pin);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon calendar(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int pad = size/6;
        g.fillRoundRect(pad, pad, size - 2*pad, size - pad - pad/2, size/8, size/8);
        g.setColor(new Color(((Color)color).getRed(), ((Color)color).getGreen(), ((Color)color).getBlue(), 180));
        g.fillRect(pad, pad, size - 2*pad, pad);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon bed(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int baseY = size/2;
        g.fillRoundRect(size/6, baseY - size/10, size*2/3, size/5, size/10, size/10);
        g.fillRect(size/6, baseY - size/4, size/5, size/6);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon suitcase(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int w = size - size/3, h = size - size/3;
        int x = (size - w)/2, y = (size - h)/2 + size/12;
        g.fillRoundRect(x, y, w, h, size/8, size/8);
        g.fillRoundRect(size/2 - size/10, y - size/6, size/5, size/8, size/8, size/8);
        g.dispose();
        return new ImageIcon(img);
    }

    public static Icon shield(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        GeneralPath s = new GeneralPath();
        s.moveTo(size/2.0, size/6.0);
        s.lineTo(size - size/6.0, size/3.0);
        s.lineTo(size/2.0, size - size/6.0);
        s.lineTo(size/6.0, size/3.0);
        s.closePath();
        g.fill(s);
        g.dispose();
        return new ImageIcon(img);
    }

    private static void setup(Graphics2D g) {
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
    }

    public static Icon star(int size, Color color) {
        BufferedImage img = new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = img.createGraphics();
        setup(g);
        g.setColor(color);
        int cx = size/2;
        int cy = size/2;
        double rOuter = size*0.45;
        double rInner = rOuter*0.5;
        GeneralPath path = new GeneralPath();
        for (int i = 0; i < 10; i++) {
            double angle = Math.toRadians(-90 + i * 36);
            double r = (i % 2 == 0) ? rOuter : rInner;
            double x = cx + r * Math.cos(angle);
            double y = cy + r * Math.sin(angle);
            if (i == 0) path.moveTo(x, y); else path.lineTo(x, y);
        }
        path.closePath();
        g.fill(path);
        g.dispose();
        return new ImageIcon(img);
    }
}


