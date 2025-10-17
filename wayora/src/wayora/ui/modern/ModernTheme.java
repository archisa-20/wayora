import java.awt.*;

public final class ModernTheme {
    public static final Color PRIMARY = new Color(76, 110, 245);
    public static final Color PRIMARY_DARK = new Color(58, 90, 230);
    public static final Color ACCENT = new Color(255, 140, 66);
    public static final Color BACKGROUND = new Color(245, 247, 250);
    public static final Color SURFACE = Color.WHITE;
    public static final Color TEXT_PRIMARY = new Color(25, 28, 35);
    public static final Color TEXT_SECONDARY = new Color(98, 104, 116);
    public static final Color SHADOW = new Color(0, 0, 0, 40);

    public static final int RADIUS = 12;
    public static final Font FONT_REGULAR = new Font("Segoe UI", Font.PLAIN, 14);
    public static final Font FONT_MEDIUM = new Font("Segoe UI", Font.PLAIN, 16);
    public static final Font FONT_BOLD = new Font("Segoe UI", Font.BOLD, 18);

    private ModernTheme() {}

    public static Paint createTopBarGradient(int width, int height) {
        return new GradientPaint(0, 0, PRIMARY, width, height, PRIMARY_DARK);
    }
}


