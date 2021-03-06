require "json"
require_relative 'Evaluate.rb'
require_relative 'MyErrors.rb'


class EqExpression 
    
    
    
    
    
    def initialize(args, assumptions, symbolic=false, pk=nil)
        @symbolic = symbolic
        @pk = pk
        @eqBlocks = JSON.parse(args)
        
        raise MissingError, "expression(s)" unless not @eqBlocks.nil?
        
        @assumptions = assumptions
        #raise RuntimeError, "Missing assumption(s)" unless not @assumptions.evaluate.empty?
        
        #if no assumptions and not symbolic throw error
        
        if(not symbolic) then
        
            #add assumptions to eq's
            @assumptions.evaluate.each do |key,val|
                
                # index of val[i] is 0 for now because we assume assumptions are raw values and not expressions
                @eqBlocks.each do |eqLine|
                        eqLine["left"].map! { |x|
                            x==key.to_s ? val[0] : x
                        } unless eqLine["left"].nil?
                        eqLine["right"].map! { |x|
                            x==key.to_s ? val[0] : x
                        } unless eqLine["right"].nil?
                end
               
            end
            
        
        end

    end
    
    
    def evaluate
        
        tmp = @eqBlocks.clone
        
        if(@symbolic) then 
            return sym_evaluate(getTail)
        end
        
        eval = Evaluator.new
         
        val = eval.solve(@eqBlocks[0]["left"])
        

        
       @eqBlocks.each do |eqLine|
           
            if(not(val == eval.solve(eqLine["right"]))) then

                return false
            
            end
            
            if not eqLine["left"].nil?  and not eqLine["left"].empty? then
                
                if(not(val==eval.solve(eqLine["left"]))) then
                    return false
                end
            
                
            end    
           
       end
        
        @eqBlocks = tmp
        return true
        
    
    end
    
    
    def getTail
       x = @eqBlocks.last.clone
       return x["right"] 
    end
    
    
    def headValid
        h = @eqBlocks.first.clone
        
        raise MissingError, "p(k)" unless @pk
        
        @pk_l = @pk.evaluate(["k","1","+"])["left"]
        
        if (not(h["left"] == @pk_l)) then
            return false
        end
        
        return true
    end
    
    def tailValid
        
        t = @eqBlocks.last.clone
        
        raise MissingError, "p(k)" unless @pk
        
        @pk_r = @pk.evaluate(["k","1","+"])["right"]

        if(not(t["right"] == @pk_r)) then
            return false
        end       
        
        return true
        
    end



    def sym_evaluate(base)
        e = Evaluator.new
        
        #check all lines are symblically equal
        same = true
        @eqBlocks.each do |eql|
            same &= e.sym_eq_equal(base,eql["left"]) unless eql["left"]==[] or eql["left"].nil?
            same &= e.sym_eq_equal(base,eql["right"])
        end
        return same
        
    end

end



    
    
