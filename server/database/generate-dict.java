import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class Main {

    private static String getNextNonEmptyLine(BufferedReader reader) throws IOException {
        String line;
        while ((line = reader.readLine()) != null) {
            if (!line.trim().isEmpty()) {
                System.out.println("Returning non-empty line: " + line);
                return line; // Return the non-empty line
            }
            System.out.println("Skipping empty line");
        }
        return null;
        // Return null if end of file is reached without finding a non-empty line
    }


    public static void main(String[] args) {
        // Define the input and output file paths
        String inputFile = "/Users/davidtaylor/projects/java/temp/src/input.txt";
        String outputFile = "output.sql";

        try (
                // Open the input and output files
                BufferedReader reader = new BufferedReader(new FileReader(inputFile));
                BufferedWriter writer = new BufferedWriter(new FileWriter(outputFile))
        ) {
            String cardNumber;
            String spanishWord;
            String englishTranslation;
            String line;

            // Read each line from the input file
            while ((line = reader.readLine()) != null) {

                cardNumber = getNextNonEmptyLine(reader);
                System.out.println("cardNumber = " + cardNumber);

                spanishWord = getNextNonEmptyLine(reader);
                System.out.println("spanishWord = " + spanishWord);

                englishTranslation = getNextNonEmptyLine(reader);
                System.out.println("englishTranslation = " + englishTranslation);

                writer.write(String.format("INSERT INTO cards VALUES (DEFAULT, '%s', 1, '%s', '%s', null, 1, 0);\n", cardNumber, spanishWord, englishTranslation));
            }
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
