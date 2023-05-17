package es.ceu.gisi.modcomp.cyk_algorithm.algorithm;

import es.ceu.gisi.modcomp.cyk_algorithm.algorithm.exceptions.CYKAlgorithmException;
import es.ceu.gisi.modcomp.cyk_algorithm.algorithm.interfaces.CYKAlgorithmInterface;
import java.util.ArrayList;
import java.util.LinkedList;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


//Comentario de prueba
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
        
       
       
        //CONDICION EN COMENTARIO
        //Lanza una excepción si ya existe una producción asociada al mismo elemento no terminal y con el mismo valor.
       if (ProduccionFinal.entrySet().stream()
        .anyMatch(entry -> entry.getKey() == nonterminal && entry.getValue().contains(production))) {
    throw new CYKAlgorithmException();
}
       else {
            productions.add(production);
            ProduccionFinal.put(nonterminal, productions);
        }
          
      
        //Problema actual: no se llega a añadir la produccion por que 
       
            
        
      
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
  
    int n = word.length();
    ArrayList<String>[][] table = new ArrayList[n][n];

    // Inicializar la tabla
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            table[i][j] = new ArrayList<>();
        }
    }

    // Llenar la diagonal principal de la tabla con los símbolos no terminales correspondientes a las letras de la palabra
    for (int i = 0; i < n; i++) {
        char symbol = word.charAt(i);
        ArrayList<String> productions = this.ProduccionFinal.get(symbol);
        if (productions != null) {
            table[i][i].addAll(productions);
        }
    }

    // Calcular las derivaciones para las subcadenas de longitud mayor a 1
    for (int j = 1; j < n; j++) {
        for (int i = j - 1; i >= 0; i--) {
            for (int k = i; k < j; k++) {
                ArrayList<String> leftProductions = table[i][k];
                ArrayList<String> rightProductions = table[k + 1][j];
                ArrayList<String> combinedProductions = table[i][j];

                for (String left : leftProductions) {
                    for (String right : rightProductions) {
                        String combined = left + right;
                        ArrayList<String> nonTerminalProductions = this.ProduccionFinal.get(combined);
                        if (nonTerminalProductions != null) {
                            combinedProductions.addAll(nonTerminalProductions);
                        }
                    }
                }
            }
        }
    }

    // Verificar si el símbolo inicial está presente en la última celda de la tabla
    ArrayList<String> startProductions = table[0][n - 1];
    if (startProductions.contains(String.valueOf(axioma))) {
        return true;
    } else {
        return false;
    }
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
        throw new UnsupportedOperationException("Not supported yet.");
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


