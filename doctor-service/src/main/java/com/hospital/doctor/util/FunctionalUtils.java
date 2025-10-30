package com.hospital.doctor.util;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Utility class demonstrating comprehensive functional programming concepts
 * including higher-order functions, function composition, custom functional interfaces,
 * and advanced stream operations.
 */
public class FunctionalUtils {

    // === CUSTOM FUNCTIONAL INTERFACES ===
    
    @FunctionalInterface
    public interface TriFunction<T, U, V, R> {
        R apply(T t, U u, V v);
        
        // Default method demonstrating function composition
        default <W> TriFunction<T, U, V, W> andThen(Function<? super R, ? extends W> after) {
            Objects.requireNonNull(after);
            return (T t, U u, V v) -> after.apply(apply(t, u, v));
        }
    }
    
    @FunctionalInterface
    public interface ValidationRule<T> {
        boolean validate(T item);
        
        // Combining validation rules
        default ValidationRule<T> and(ValidationRule<T> other) {
            return item -> this.validate(item) && other.validate(item);
        }
        
        default ValidationRule<T> or(ValidationRule<T> other) {
            return item -> this.validate(item) || other.validate(item);
        }
    }

    // === HIGHER-ORDER FUNCTIONS ===
    
    /**
     * Creates a function that applies multiple transformations in sequence
     */
    @SafeVarargs
    public static <T> Function<T, T> compose(Function<T, T>... functions) {
        return Arrays.stream(functions)
            .reduce(Function.identity(), Function::andThen);
    }
    
    /**
     * Creates a predicate that combines multiple conditions with AND logic
     */
    @SafeVarargs
    public static <T> Predicate<T> allOf(Predicate<T>... predicates) {
        return Arrays.stream(predicates)
            .reduce(Predicate::and)
            .orElse(x -> true);
    }
    
    /**
     * Creates a predicate that combines multiple conditions with OR logic
     */
    @SafeVarargs
    public static <T> Predicate<T> anyOf(Predicate<T>... predicates) {
        return Arrays.stream(predicates)
            .reduce(Predicate::or)
            .orElse(x -> false);
    }
    
    /**
     * Curried function example - transforms a binary function into a series of unary functions
     */
    public static <T, U, R> Function<T, Function<U, R>> curry(BiFunction<T, U, R> biFunction) {
        return t -> u -> biFunction.apply(t, u);
    }
    
    /**
     * Partial application - fixes the first argument of a binary function
     */
    public static <T, U, R> Function<U, R> partial(BiFunction<T, U, R> biFunction, T fixedValue) {
        return u -> biFunction.apply(fixedValue, u);
    }

    // === ADVANCED STREAM OPERATIONS ===
    
    /**
     * Groups elements by a classifier and applies a transformation to each group
     */
    public static <T, K, R> Map<K, R> groupAndTransform(
            Collection<T> items,
            Function<T, K> classifier,
            Function<List<T>, R> groupTransformer) {
        
        return items.stream()
            .collect(Collectors.groupingBy(classifier))
            .entrySet().stream()
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                entry -> groupTransformer.apply(entry.getValue())
            ));
    }
    
    /**
     * Finds the first element matching multiple conditions
     */
    @SafeVarargs
    public static <T> Optional<T> findFirst(Collection<T> items, Predicate<T>... conditions) {
        return items.stream()
            .filter(allOf(conditions))
            .findFirst();
    }
    
    /**
     * Transforms and filters in a single operation
     */
    public static <T, R> List<R> mapAndFilter(
            Collection<T> items,
            Function<T, R> mapper,
            Predicate<R> filter) {
        
        return items.stream()
            .map(mapper)
            .filter(filter)
            .collect(Collectors.toList());
    }
    
    /**
     * Reduces a collection with an initial value and accumulator function
     */
    public static <T, R> R reduce(
            Collection<T> items,
            R identity,
            BiFunction<R, T, R> accumulator) {
        
        return items.stream()
            .reduce(identity, accumulator, (r1, r2) -> r2);
    }

    // === FUNCTIONAL VALIDATION UTILITIES ===
    
    /**
     * Validates an object against multiple rules
     */
    @SafeVarargs
    public static <T> boolean validateAll(T item, ValidationRule<T>... rules) {
        return Arrays.stream(rules)
            .allMatch(rule -> rule.validate(item));
    }
    
    /**
     * Collects validation errors for an object
     */
    public static <T> List<String> collectValidationErrors(
            T item,
            Map<String, ValidationRule<T>> namedRules) {
        
        return namedRules.entrySet().stream()
            .filter(entry -> !entry.getValue().validate(item))
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    // === MEMOIZATION (CACHING) UTILITY ===
    
    /**
     * Creates a memoized version of a function that caches results
     */
    public static <T, R> Function<T, R> memoize(Function<T, R> function) {
        Map<T, R> cache = new ConcurrentHashMap<>();
        return input -> cache.computeIfAbsent(input, function);
    }

    // === LAZY EVALUATION UTILITIES ===
    
    /**
     * Creates a lazy supplier that computes value only when needed
     */
    public static <T> Supplier<T> lazy(Supplier<T> supplier) {
        return new Supplier<T>() {
            private volatile T value;
            private volatile boolean computed = false;
            
            @Override
            public T get() {
                if (!computed) {
                    synchronized (this) {
                        if (!computed) {
                            value = supplier.get();
                            computed = true;
                        }
                    }
                }
                return value;
            }
        };
    }

    // === FUNCTIONAL PIPELINE UTILITIES ===
    
    /**
     * Creates a processing pipeline for transforming data
     */
    public static class Pipeline<T> {
        private final Stream<T> stream;
        
        private Pipeline(Stream<T> stream) {
            this.stream = stream;
        }
        
        public static <T> Pipeline<T> of(Collection<T> items) {
            return new Pipeline<>(items.stream());
        }
        
        public Pipeline<T> filter(Predicate<T> predicate) {
            return new Pipeline<>(stream.filter(predicate));
        }
        
        public <R> Pipeline<R> map(Function<T, R> mapper) {
            return new Pipeline<>(stream.map(mapper));
        }
        
        public Pipeline<T> sorted(Comparator<T> comparator) {
            return new Pipeline<>(stream.sorted(comparator));
        }
        
        public List<T> collect() {
            return stream.collect(Collectors.toList());
        }
        
        public Optional<T> findFirst() {
            return stream.findFirst();
        }
        
        public long count() {
            return stream.count();
        }
    }

    // === EXAMPLE USAGE METHODS ===
    
    /**
     * Example demonstrating function composition
     */
    public static Function<String, String> createStringProcessor() {
        Function<String, String> trim = String::trim;
        Function<String, String> toLowerCase = String::toLowerCase;
        Function<String, String> removeSpaces = s -> s.replaceAll("\\s+", "");
        
        return compose(trim, toLowerCase, removeSpaces);
    }
    
    /**
     * Example demonstrating currying
     */
    public static Function<String, Function<String, String>> createFormatter() {
        BiFunction<String, String, String> format = (template, value) -> 
            template.replace("{}", value);
        
        return curry(format);
    }
}
