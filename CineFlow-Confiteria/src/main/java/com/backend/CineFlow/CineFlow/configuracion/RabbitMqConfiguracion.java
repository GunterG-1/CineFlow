package com.backend.CineFlow.CineFlow.configuracion;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfiguracion {

    @Bean
    public TopicExchange cineflowExchange(@Value("${app.events.exchange:cineflow.events.exchange}") String exchangeName) {
        return new TopicExchange(exchangeName, true, false);
    }

    @Bean
    public Queue ticketPaidConfiteriaQueue(
        @Value("${app.events.ticket-paid.confiteria-queue:ticket.paid.confiteria.queue}") String queueName
    ) {
        return new Queue(queueName, true);
    }

    @Bean
    public Binding ticketPaidConfiteriaBinding(
        Queue ticketPaidConfiteriaQueue,
        TopicExchange cineflowExchange,
        @Value("${app.events.ticket-paid.routing-key:ticket.paid}") String routingKey
    ) {
        return BindingBuilder.bind(ticketPaidConfiteriaQueue).to(cineflowExchange).with(routingKey);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
}
