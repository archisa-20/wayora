import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Main {
    private static JPanel sidebar;
    private static JPanel contentPanel;
    private static CardLayout cardLayout;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(Main::createAndShowUI);
    }

    private static void createAndShowUI() {
        JFrame frame = new JFrame("WayOra - Travel Companion");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1100, 700);
        frame.setLocationRelativeTo(null);
        frame.setLayout(new BorderLayout());
        frame.getContentPane().setBackground(ModernTheme.BACKGROUND);

        // Top bar with gradient and hamburger
        JPanel topBar = new JPanel() {
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setPaint(ModernTheme.createTopBarGradient(getWidth(), getHeight()));
                g2.fillRect(0, 0, getWidth(), getHeight());
                g2.dispose();
            }
        };
        topBar.setLayout(new BorderLayout());
        topBar.setPreferredSize(new Dimension(0, 56));

        JButton menuBtn = new JButton(IconFactory.menu(24, Color.WHITE));
        menuBtn.setBorderPainted(false);
        menuBtn.setContentAreaFilled(false);
        menuBtn.setFocusPainted(false);
        menuBtn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        menuBtn.getAccessibleContext().setAccessibleName("Toggle navigation");
        menuBtn.addActionListener(e -> toggleSidebarAnimated(frame));

        JLabel title = new JLabel("  WayOra", JLabel.LEFT);
        title.setFont(ModernTheme.FONT_BOLD);
        title.setForeground(Color.WHITE);

        JPanel leftTop = new JPanel(new FlowLayout(FlowLayout.LEFT, 12, 12));
        leftTop.setOpaque(false);
        leftTop.add(menuBtn);
        leftTop.add(title);

        topBar.add(leftTop, BorderLayout.WEST);
        frame.add(topBar, BorderLayout.NORTH);

        // Sidebar (animated width)
        sidebar = createSidebarPanel(frame);
        frame.add(sidebar, BorderLayout.WEST);

        // Content panel with CardLayout inside surface padding
        JPanel contentWrapper = new JPanel(new BorderLayout());
        contentWrapper.setOpaque(false);
        contentWrapper.setBorder(BorderFactory.createEmptyBorder(16,16,16,16));

        cardLayout = new CardLayout();
        contentPanel = new JPanel(cardLayout);
        contentPanel.setOpaque(false);
        contentPanel.add(new TripManagementPanel(), "TRIPS");
        contentPanel.add(new ItineraryPlannerPanel(), "ITINERARY");
        contentPanel.add(new AccommodationPanel(), "ACCOMMODATION");
        contentPanel.add(new PackingListPanel(), "PACKING");
        contentPanel.add(new SafetyContactPanel(), "SAFETY");
        contentWrapper.add(contentPanel, BorderLayout.CENTER);

        frame.add(contentWrapper, BorderLayout.CENTER);
        frame.setVisible(true);
    }

    private static JPanel createSidebarPanel(JFrame frame) {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        panel.setBackground(new Color(24, 26, 31));
        panel.setPreferredSize(new Dimension(220, 0));
        panel.setBorder(BorderFactory.createEmptyBorder(12, 12, 12, 12));

        addSidebarButton(panel, "Trips", "TRIPS", ModernIcons.tripsIcon(18, Color.WHITE));
        addSidebarButton(panel, "Itinerary", "ITINERARY", ModernIcons.itineraryIcon(18, Color.WHITE));
        addSidebarButton(panel, "Accommodation", "ACCOMMODATION", ModernIcons.accommodationIcon(18, Color.WHITE));
        addSidebarButton(panel, "Packing", "PACKING", ModernIcons.packingIcon(18, Color.WHITE));
        addSidebarButton(panel, "Safety", "SAFETY", ModernIcons.safetyIcon(18, Color.WHITE));

        return panel;
    }

    private static void addSidebarButton(JPanel container, String text, String card, Icon icon) {
        JButton btn = new JButton(text, icon);
        btn.setAlignmentX(Component.LEFT_ALIGNMENT);
        btn.setMaximumSize(new Dimension(220, 44));
        btn.setMinimumSize(new Dimension(220, 44));
        btn.setPreferredSize(new Dimension(220, 44));
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setContentAreaFilled(false);
        btn.setForeground(Color.WHITE);
        btn.setFont(ModernTheme.FONT_MEDIUM);
        btn.setHorizontalAlignment(SwingConstants.LEFT);
        btn.setHorizontalTextPosition(SwingConstants.RIGHT);
        btn.setIconTextGap(12);
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        btn.setBorder(BorderFactory.createEmptyBorder(10,12,10,10));

        // No hover submenu

        btn.addActionListener(e -> {
            cardLayout.show(contentPanel, card);
        });

        container.add(Box.createVerticalStrut(6));
        container.add(btn);
    }

    // Submenu helpers removed

    private static void toggleSidebarAnimated(JFrame frame) {
        int start = sidebar.getWidth();
        int target = start == 0 ? 220 : 0;
        Timer timer = new Timer(10, null);
        timer.addActionListener(e -> {
            int w = sidebar.getWidth();
            int step = 20 * (target > start ? 1 : -1);
            int next = w + step;
            if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
                next = target;
                ((Timer)e.getSource()).stop();
            }
            sidebar.setPreferredSize(new Dimension(Math.max(0, next), sidebar.getHeight()));
            sidebar.revalidate();
            frame.revalidate();
        });
        timer.start();
    }
}
