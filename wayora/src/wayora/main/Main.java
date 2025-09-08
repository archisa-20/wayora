package wayora.main;

import java.util.Scanner;

public class Main {
    private static final Scanner sc=new Scanner(System.in);
    public static void main(String[] args){
        new Main().run();
    }

    private void run(){
        while (true){
            switch (mainMenu()){
                case 1 -> tripsMenu();
                case 2 -> itineraryMenu();
                case 3 -> accommodationMenu();
                case 4 -> packingMenu();
                case 5 -> safetyMenu();
                case 0 -> {
                    System.out.println("Bye Bye!");
                    return;
                }
                default -> System.out.println("Invalid choice. try again.");
            }
        }
    }

private int mainMenu(){
    System.out.println("\n=== WAYORA ===");
    System.out.println("1) Trips");
    System.out.println("2) Itinerary");
    System.out.println("3) Accommodation");
    System.out.println("4) Packing");
    System.out.println("5) Safety");
    System.out.println("0) Exit");
    System.out.println("Enter choice: ");
    return readInt();
}

private void tripsMenu(){
    System.out.println("[todo] Trip Management coming soon.");
}

private void itineraryMenu(){
    System.out.println("[todo] Itinerary Planner coming soon.");
}

private void accommodationMenu(){
    System.out.println("[todo] Accommodation Management coming soon.");
}

private void packingMenu(){
    System.out.println("[todo] Packing List Management coming soon.");
}

private void safetyMenu(){
    System.out.println("[todo] Safety Contact Directory coming soon.");
}

private int readInt(){
    while (!sc.hasNextInt()){
        System.out.print("Enter a valid number: ");
        sc.next();
    }
    int val = sc.nextInt();
    sc.nextLine();
    return val;
}
}
