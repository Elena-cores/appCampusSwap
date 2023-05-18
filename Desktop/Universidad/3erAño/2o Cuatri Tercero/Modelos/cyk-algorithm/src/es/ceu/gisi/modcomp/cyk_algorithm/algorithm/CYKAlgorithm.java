package es.ceu.gisi.modcomp.cyk_algorithm.algorithm;

import es.ceu.gisi.modcomp.cyk_algorithm.algorithm.exceptions.CYKAlgorithmException;
import es.ceu.gisi.modcomp.cyk_algorithm.algorithm.interfaces.CYKAlgorithmInterface;
import java.util.ArrayList;
import java.util.LinkedList;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;



/**
 * Esta clase contiene la implementación de la interfaz CYKAlgorithmInterface
 * que establece los métodos necesarios para el correcto funcionamiento del
 * proyecto de programación de la asignatura Modelos de Computación.
 *
 * @author Sergio Saugar García <sergio.saugargarcia@ceu.es>
 */
public class CYKAlgorithm implements CYKAlgorithmInterface {
    private final ArrayList<Character> nonTerminals = new ArrayList<>();
    private final LinkedList<Character> terminals = new LinkedList<>();
    private final HashMap<Character, ArrayList<String>> ProduccionFinal = new HashMap<>();

    
   
    private char axioma;
   
    
    @Override
    /**
     * Método que añade los elementos no terminales de la gramática.
     *
     * @param nonterminal Por ejemplo, 'S'
     * @throws CYKAlgorithmException Si el elemento no es una letra mayúscula.
     */
    public void addNonTerminal(char nonterminal) throws CYKAlgorithmException {

        if (Character.isLowerCase(nonterminal) || Character.isDigit(nonterminal)) {
            throw new CYKAlgorithmException();
        } 
        
        if(nonTerminals.contains(nonterminal)){
            throw new CYKAlgorithmException();
        }
            
        else {
            nonTerminals.add(nonterminal);
            }
        
    }
        
    @Override
    /**
     * Método que añade los elementos terminales de la gramática.
     *
     * @param terminal Por ejemplo, 'a'
     * @throws CYKAlgorithmException Si el elemento no es una letra minúscula.
     */
    
    
    public void addTerminal(char terminal) throws CYKAlgorithmException {
        
       if(!Character.isLowerCase(terminal)|| Character.isDigit(terminal)){
            throw new CYKAlgorithmException();
       }
       if(terminals.contains(terminal)){
            throw new CYKAlgorithmException();
       }
       else{
            terminals.add(terminal);
       }
    }

    @Override
    /**
     * Método que indica, de los elementos no terminales, cuál es el axioma de
     * la gramática.
     *
     * @param nonterminal Por ejemplo, 'S'
     * @throws CYKAlgorithmException Si el elemento insertado no forma parte del
     * conjunto de elementos no terminales.
     */
    public void setStartSymbol(char nonterminal) throws CYKAlgorithmException {
     /*   if (!nonTerminals.contains(nonterminal)){
                         throw new CYKAlgorithmException();
        }*/
        //si la lista de nonterminals esta vacía salta la excepción
        
        
        if (nonTerminals.size() < 1){
            throw new CYKAlgorithmException();
        } 
        //si el nonterminal que nos pasa el test no es el nonterminal del primer espacio de la estructura de datos, salta la excepción
        else if (nonTerminals.get(0) != nonterminal){
            throw new CYKAlgorithmException();
        }
        
        else {
        axioma = nonterminal;
        
        }
        
    }   
      
    @Override
    /**
     * Método utilizado para construir la gramática. Admite producciones en FNC,
     * es decir de tipo A::=BC o A::=a
     *
     * @param nonterminal A
     * @param production "BC" o "a"
     * @throws CYKAlgorithmException Si la producción no se ajusta a FNC o está
     * compuesta por elementos (terminales o no terminales) no definidos
     * previamente.
     */
    public void addProduction(char nonterminal, String production) throws CYKAlgorithmException {

           ArrayList<String> productions = this.ProduccionFinal.get(nonterminal);
         if (productions == null) {
           productions = new ArrayList<>();
           
       }


        //Lanza una excepción si un carácter en la posición i de la producción es una letra minuscula y no está contenido en la lista de terminales.
        for (int i = 1; i < production.length(); i++) {
            if (Character.isLowerCase(production.charAt(i)) && !terminals.contains(production.charAt(i))) {
                throw new CYKAlgorithmException();
            }
                    //Lanza una excepción si un carácter en la posición i de la producción es una letra mayuscula y no está contenido en la lista de noterminales.

            else if (Character.isUpperCase(production.charAt(i)) && !nonTerminals.contains(production.charAt(i))) {
                throw new CYKAlgorithmException();
            
            }
        }
        
        for (char c : production.toCharArray()) {
            for (char cc : production.toCharArray()) {                
                
                if(production.length() == 1 ){
                    if(Character.isUpperCase(c)){
                        throw new CYKAlgorithmException();                     
                    }
                    if(!terminals.contains(c)){
                        throw new CYKAlgorithmException(); 
                    }
                                        
                }
                else if(production.length() == 2 ){
                    if(!nonTerminals.contains(c)){
                        throw new CYKAlgorithmException(); 
                       
                    }
                }
                else if(production.length() > 2){
                    throw new CYKAlgorithmException(); 
                }
                
                
                //Lanza una excepción si la producción tiene longitud mayor a 1 y contiene una letra minúscula.
                if(production.length() > 1 && Character.isLowerCase(c)){
                    throw new CYKAlgorithmException();
                }
                                
                //Lanza una excepción si en la producción se encuentra una combinación de una letra mayúscula y una minúscula.
                if( (Character.isUpperCase(c) && Character.isLowerCase(cc))|| (Character.isUpperCase(cc) && Character.isLowerCase(c))){
                throw new CYKAlgorithmException();
                }
            }
        }
    
          
        //Lanza una excepción si el elemento no terminal no está contenido en la lista de no terminales. 
        
        if (!nonTerminals.contains(nonterminal)) { 
            throw new CYKAlgorithmException();
        }  
        
       
       
        //Lanza una excepción si ya existe una producción asociada al mismo elemento no terminal y con el mismo valor.
       if (ProduccionFinal.entrySet().stream()
        .anyMatch(entry -> entry.getKey() == nonterminal && entry.getValue().contains(production))) {
    throw new CYKAlgorithmException();
}
       else {
            productions.add(production);
            ProduccionFinal.put(nonterminal, productions);
        }
     
      
}         
    


    @Override
    /**
     * Método que indica si una palabra pertenece al lenguaje generado por la
     * gramática que se ha introducido.
     *
     * @param word La palabra a verificar, tiene que estar formada sólo por
     * elementos no terminales.
     * @return TRUE si la palabra pertenece, FALSE en caso contrario
     * @throws CYKAlgorithmException Si la palabra proporcionada no está formada
     * sólo por terminales, si está formada por terminales que no pertenecen al
     * conjunto de terminales definido para la gramática introducida, si la
     * gramática es vacía o si el autómata carece de axioma.
     */
    

public boolean isDerived(String word) throws CYKAlgorithmException {
    // Validaciones iniciales
    if (word.isEmpty()) {
        throw new CYKAlgorithmException();
    }

    for (char c : word.toCharArray()) {
        if (!terminals.contains(c)) {
            throw new CYKAlgorithmException();
        }
    }

    if (terminals.isEmpty()) {
        throw new CYKAlgorithmException();
    }

    if (nonTerminals.isEmpty()) {
        throw new CYKAlgorithmException();
    }

    if (axioma == '\0') {
        throw new CYKAlgorithmException();
    }

    // Algoritmo CYK
    int n = word.length();
    List<List<Set<Character>>> table = new ArrayList<>(n);

    // Inicializar tabla
    for (int i = 0; i < n; i++) {
        table.add(new ArrayList<>(n));
        for (int j = 0; j < n; j++) {
            table.get(i).add(new HashSet<>());
        }
    }

    // Llenar la tabla con las producciones unitarias
    for (int i = 0; i < n; i++) {
        char terminal = word.charAt(i);
        for (int j = 0; j < nonTerminals.size(); j++) {
            char nonTerminal = nonTerminals.get(j);
            ArrayList<String> productions = ProduccionFinal.get(nonTerminal);

            if (productions != null) {
                for (String production : productions) {
                    if (production.length() == 1 && production.charAt(0) == terminal) {
                        table.get(i).get(0).add(nonTerminal);
                    }
                }
            }
        }
    }

    // Llenar la tabla con las producciones generales
    for (int length = 2; length <= n; length++) {
        for (int start = 0; start <= n - length; start++) {
            for (int k = 1; k <= length - 1; k++) {
                int end = start + length - 1;
                for (int i = 0; i < nonTerminals.size(); i++) {
                    char nonTerminal = nonTerminals.get(i);
                    ArrayList<String> productions = ProduccionFinal.get(nonTerminal);

                    if (productions != null) {
                        for (String production : productions) {
                            if (production.length() == 2) {
                                char A = production.charAt(0);
                                char B = production.charAt(1);

                                Set<Character> setA = table.get(start).get(k - 1);
                                Set<Character> setB = table.get(start + k).get(length - k - 1);

                                if (setA.contains(A) && setB.contains(B)) {
                                    table.get(start).get(length - 1).add(nonTerminal);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Comprobar si el axioma está en la última celda de la tabla
    Set<Character> axiomaSet = table.get(0).get(n - 1);
    algorithmStateToString(word);
    return axiomaSet.contains(axioma);
    
}


    @Override
    /**
     * Método que, para una palabra, devuelve un String que contiene todas las
     * celdas calculadas por el algoritmo (la visualización debe ser similar al
     * ejemplo proporcionado en el PDF que contiene el paso a paso del
     * algoritmo).
     *
     * @param word La palabra a verificar, tiene que estar formada sólo por
     * elementos no terminales.
     * @return Un String donde se vea la tabla calculada de manera completa,
     * todas las celdas que ha calculado el algoritmo.
     * @throws CYKAlgorithmException Si la palabra proporcionada no está formada
     * sólo por terminales, si está formada por terminales que no pertenecen al
     * conjunto de terminales definido para la gramática introducida, si la
     * gramática es vacía o si el autómata carece de axioma.
     */

public String algorithmStateToString(String word) throws CYKAlgorithmException {
    // Validaciones iniciales
    if (word.isEmpty()) {
        throw new CYKAlgorithmException();
    }

    for (char c : word.toCharArray()) {
        if (!terminals.contains(c)) {
            throw new CYKAlgorithmException();
        }
    }

    if (terminals.isEmpty()) {
        throw new CYKAlgorithmException();
    }

    if (nonTerminals.isEmpty()) {
        throw new CYKAlgorithmException();
    }

    if (axioma == '\0') {
        throw new CYKAlgorithmException();
    }

    // Algoritmo CYK
    int n = word.length();
    List<List<Set<Character>>> table = new ArrayList<>(n);

    // Inicializar tabla
    for (int i = 0; i < n; i++) {
        table.add(new ArrayList<>(n));
        for (int j = 0; j < n; j++) {
            table.get(i).add(new HashSet<>());
        }
    }

    // Llenar la tabla con las producciones unitarias
    for (int i = 0; i < n; i++) {
        char terminal = word.charAt(i);
        for (int j = 0; j < nonTerminals.size(); j++) {
            char nonTerminal = nonTerminals.get(j);
            ArrayList<String> productions = ProduccionFinal.get(nonTerminal);

            if (productions != null) {
                for (String production : productions) {
                    if (production.length() == 1 && production.charAt(0) == terminal) {
                        table.get(i).get(0).add(nonTerminal);
                    }
                }
            }
        }
    }

    // Llenar la tabla con las producciones generales
    for (int length = 2; length <= n; length++) {
        for (int start = 0; start <= n - length; start++) {
            for (int k = 1; k <= length - 1; k++) {
                int end = start + length - 1;
                for (int i = 0; i < nonTerminals.size(); i++) {
                    char nonTerminal = nonTerminals.get(i);
                    ArrayList<String> productions = ProduccionFinal.get(nonTerminal);

                    if (productions != null) {
                        for (String production : productions) {
                            if (production.length() == 2) {
                                char A = production.charAt(0);
                                char B = production.charAt(1);

                                Set<Character> setA = table.get(start).get(k - 1);
                                Set<Character> setB = table.get(start + k).get(length - k - 1);

                                if (setA.contains(A) && setB.contains(B)) {
                                    table.get(start).get(length - 1).add(nonTerminal);
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    // Construir el String de salida
    StringBuilder sb = new StringBuilder();
    sb.append(" ");
    for (int i = 1; i <= n; i++) {
        sb.append(String.format("%7d", i));
    }
    sb.append("\n");
    for (int j = 0; j < n; j++) {
        sb.append(String.format("%2d", j + 1));
        for (int i = 0; i < n - j; i++) {
            Set<Character> set = table.get(i).get(j);
        
            sb.append(String.format("%7s", set.toString()));
        }
        sb.append("\n");
    }
    
    System.out.println(sb.toString());
    return sb.toString();
    }

                    
    @Override
    /**
     * Elimina todos los elementos que se han introducido hasta el momento en la
     * gramática (elementos terminales, no terminales, axioma y producciones),
     * dejando el algoritmo listo para volver a insertar una gramática nueva.
     */
    public void removeGrammar() {
        
        nonTerminals.clear();
        terminals.clear();
        ProduccionFinal.clear();
        axioma ='\0';
        
    }

    @Override
    /**
     * Devuelve un String que representa todas las producciones que han sido
     * agregadas a un elemento no terminal.
     *
     * @param nonterminal
     * @return Devuelve un String donde se indica, el elemento no terminal, el
     * símbolo de producción "::=" y las producciones agregadas separadas, única
     * y exclusivamente por una barra '|' (no incluya ningún espacio). Por
     * ejemplo, si se piden las producciones del elemento 'S', el String de
     * salida podría ser: "S::=AB|BC".
     */
  

public String getProductions(char nonterminal) {
    ArrayList<String> productionList = ProduccionFinal.get(nonterminal);
    if (productionList == null) {
        return "";
    } else {
        StringBuilder sb = new StringBuilder();
        sb.append(nonterminal).append("::=");
        for (String production : productionList) {
            sb.append(production).append("|");
        }
        sb.deleteCharAt(sb.length() - 1);  // Eliminar el último "|"
        return sb.toString();
    }


}

    @Override
    /**
     * Devuelve un String con la gramática completa.
     *
     * @return Devuelve el agregado de hacer getProductions sobre todos los
     * elementos no terminales.
     */
   
public String getGrammar() {
    StringBuilder grammar = new StringBuilder();
    
    for (char nonterminal : nonTerminals) {
        String productions = getProductions(nonterminal);
        if (!productions.isEmpty()) {
            if (grammar.length() > 0) {
                grammar.append("\n");
            }
            grammar.append(productions);
        }
    }
    
    return grammar.toString();
}

    }


