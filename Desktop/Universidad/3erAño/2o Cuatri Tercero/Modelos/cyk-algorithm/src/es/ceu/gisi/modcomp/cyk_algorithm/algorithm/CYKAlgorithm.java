package es.ceu.gisi.modcomp.cyk_algorithm.algorithm;

import es.ceu.gisi.modcomp.cyk_algorithm.algorithm.exceptions.CYKAlgorithmException;
import es.ceu.gisi.modcomp.cyk_algorithm.algorithm.interfaces.CYKAlgorithmInterface;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Objects;
import java.util.HashMap;
import java.util.HashSet;

//Comentario de prueba
/**
 * Esta clase contiene la implementación de la interfaz CYKAlgorithmInterface
 * que establece los métodos necesarios para el correcto funcionamiento del
 * proyecto de programación de la asignatura Modelos de Computación.
 *
 * @author Sergio Saugar García <sergio.saugargarcia@ceu.es>
 */
public class CYKAlgorithm implements CYKAlgorithmInterface {
    private ArrayList<Character> nonTerminals = new ArrayList<>();
    private LinkedList<Character> terminals = new LinkedList<>();
    private HashMap<Character, String> ProduccionFinal = new HashMap<>();
    
    private ArrayList<String> listProductions = new ArrayList<>(); 
    
    char nonterminal;
    char terminal;
    char axioma;
   
    
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
        if (nonTerminals.size() < 1){
            throw new CYKAlgorithmException();
        } 
        
        else if (nonTerminals.get(0) != nonterminal){
            throw new CYKAlgorithmException();
        }
        
        else {
        axioma = nonterminal;
        //nonTerminals.add(nonterminal);
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
        
        for (int i = 1; i < production.length(); i++) {
            if (!Character.isUpperCase(production.charAt(i)) && !terminals.contains(production.charAt(i))) {
                throw new CYKAlgorithmException();
            
            }
        }
        for (char c : production.toCharArray()) {
            if (Character.isUpperCase(c) && !nonTerminals.contains(c)) {
                throw new CYKAlgorithmException();
            } 
            else if (!Character.isUpperCase(c) && !terminals.contains(c)) {
                throw new CYKAlgorithmException();
            }
            
            for (char cc : production.toCharArray()) {
                if( (Character.isUpperCase(c) && Character.isLowerCase(cc))|| (Character.isUpperCase(cc) && Character.isLowerCase(c))){
                throw new CYKAlgorithmException();
                }
            }
            
          
        }
    
          
                
        //Si el array de los no terminales ve que no tiene el noterminal añadido en el addProduction, salta la excepcion
        if (!nonTerminals.contains(nonterminal)) { 
            throw new CYKAlgorithmException();
        }   

        if (production.length()== 1 && production.contains(production.toUpperCase())) {
            throw new CYKAlgorithmException();
        }     
        if (production.length() > 1 && production.contains(production.toLowerCase())){
            throw new CYKAlgorithmException();
        }

        if (ProduccionFinal.containsKey(nonterminal) && ProduccionFinal.containsValue(production)){
            throw new CYKAlgorithmException();
        }

        if (ProduccionFinal.containsKey( axioma)){
            throw new CYKAlgorithmException();
        }

     
        if (!ProduccionFinal.values().stream().anyMatch(p -> p.matches(".*[a-z].*")) && production.matches(".*[A-Z].*")) {
            throw new CYKAlgorithmException();
        }
        
      
            
        else{
          ProduccionFinal.put(nonterminal, production);
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
        throw new UnsupportedOperationException("Not supported yet.");
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
        throw new UnsupportedOperationException("Not supported yet.");
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
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    /**
     * Devuelve un String con la gramática completa.
     *
     * @return Devuelve el agregado de hacer getProductions sobre todos los
     * elementos no terminales.
     */
    public String getGrammar() {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}
